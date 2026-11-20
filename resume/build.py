"""Build the public, single-page resume from its editable content."""

import json
import sys
from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parent.parent
FONTS = Path("/System/Library/Fonts/Supplemental")
for suffix, filename in [
    ("", "Times New Roman.ttf"),
    ("-Bold", "Times New Roman Bold.ttf"),
    ("-Italic", "Times New Roman Italic.ttf"),
    ("-BoldItalic", "Times New Roman Bold Italic.ttf"),
]:
    pdfmetrics.registerFont(TTFont(f"Resume{suffix}", str(FONTS / filename)))
pdfmetrics.registerFontFamily("Resume", normal="Resume", bold="Resume-Bold", italic="Resume-Italic", boldItalic="Resume-BoldItalic")
BLUE = colors.HexColor("#0055AA")
BODY = ParagraphStyle("Body", fontName="Resume", fontSize=10, leading=12)
BOLD = ParagraphStyle("Bold", parent=BODY, fontName="Resume-Bold")
EMPLOYER = ParagraphStyle("Employer", parent=BOLD, textColor=BLUE)
DATE = ParagraphStyle("Date", parent=BOLD, alignment=2)
NAME = ParagraphStyle("Name", parent=BOLD, fontSize=18, leading=22, alignment=TA_CENTER, textColor=BLUE)
CONTACT = ParagraphStyle("Contact", parent=BODY, fontSize=9.5, leading=12, alignment=TA_CENTER)
HEADING = ParagraphStyle("Heading", parent=BOLD, fontSize=11.5, leading=14, textColor=BLUE)
BULLET = ParagraphStyle("Bullet", parent=BODY, leftIndent=12, firstLineIndent=0, bulletIndent=3, spaceBefore=1)
CERT_BULLET = ParagraphStyle("CertificationBullet", parent=BULLET, spaceBefore=0)
WIDTH = A4[0] - 84


def text(value):
    return escape(value, {'"': "&quot;"})


def link(label, url, color="#0055AA"):
    return f'<link href="{text(url)}" color="{color}">{text(label)}</link>'


def row(left, right):
    table = Table([[Paragraph(left, BOLD), Paragraph(text(right), DATE)]], colWidths=[WIDTH - 150, 150])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return table


def section(story, title):
    story.extend([
        Spacer(1, 7),
        Paragraph(title, HEADING),
        HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#555555"), spaceAfter=5),
    ])


def build(output):
    data = json.loads((ROOT / "resume/content.json").read_text())
    story = [
        Paragraph(text(data["name"]), NAME),
        Paragraph(f'{text(data["location"])} | {link(data["email"], "mailto:" + data["email"])}', CONTACT),
        Paragraph(" | ".join(link(item["label"], item["url"]) for item in data["links"]), CONTACT),
    ]

    section(story, "EXPERIENCE")
    for job in data["experience"]:
        company = link(job["company"], job["url"]) if job.get("url") else text(job["company"])
        block = [Paragraph(company, EMPLOYER)]
        for role in job["roles"]:
            block.append(row(text(role["title"]), role["period"]))
            block.extend(Paragraph(text(bullet), BULLET, bulletText="\u2022") for bullet in role["bullets"])
            block.append(Spacer(1, 4))
        story.append(KeepTogether(block))

    section(story, "SKILLS")
    for skill in data["skills"]:
        story.append(Paragraph(f'<b>{text(skill["label"])}:</b> {text(skill["value"])}', BODY))

    section(story, "PROJECTS &amp; OSS CONTRIBUTIONS")
    for project in data["projects"]:
        story.append(KeepTogether([
            row(link(project["title"], project["url"]), project["period"]),
            Paragraph(text(project["description"]), BULLET, bulletText="\u2022"),
            Paragraph(f'<b>{text(project["metrics"])}</b>', BULLET),
            Spacer(1, 4),
        ]))

    contribution = data["open_source"]
    block = [row(link(contribution["title"], contribution["url"]), contribution["period"])]
    for bullet in contribution["bullets"]:
        references = ", ".join(link(reference["label"], reference["url"]) for reference in bullet["references"])
        block.append(Paragraph(f'{text(bullet["text"])} (merged {references}).', BULLET, bulletText="\u2022"))
    block.append(Spacer(1, 3))
    story.append(KeepTogether(block))

    section(story, "CERTIFICATIONS &amp; COMMUNITY")
    for cert in data["certifications"]:
        story.append(Paragraph(link(cert["title"], cert["url"], "#171717"), CERT_BULLET, bulletText="\u2022"))
    story.append(Paragraph(f'<b>Community:</b> {text(data["community"])}', BODY))

    section(story, "EDUCATION")
    for education in data["education"]:
        block = [row(text(education["school"]), education["period"]), Paragraph(text(education["degree"]), BODY)]
        if education.get("details"):
            block.append(Paragraph(text(education["details"]), BULLET, bulletText="\u2022"))
        block.append(Spacer(1, 2))
        story.append(KeepTogether(block))

    buffer = BytesIO()
    SimpleDocTemplate(buffer, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=20, bottomMargin=24,
                      title=f'{data["name"]} - Resume', author=data["name"]).build(story)
    pdf = buffer.getvalue()
    if len(PdfReader(BytesIO(pdf)).pages) != 1:
        raise ValueError("Resume exceeds one page. Edit content or spacing before publishing.")
    output.write_bytes(pdf)
    print(f"Built one-page resume: {output}")


if __name__ == "__main__":
    build(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public/resume.pdf")
