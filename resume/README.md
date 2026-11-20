# Resume

Edit `content.json`, then rebuild the PDF linked by the portfolio:

```sh
uv run --with reportlab==5.1.0 --with pypdf==7.1.1 python resume/build.py
```

The script writes `public/resume.pdf` and rejects content that exceeds one A4 page.
It embeds the Times New Roman fonts supplied with macOS.
Pass an output path to generate a review copy before replacing the public file.
Render the result with `pdftoppm` and check spacing and links before committing.

The resume content is maintained separately from the website's profile records.

## Fact check: November 20, 2026

- [GitHub repository metadata](https://api.github.com/repos/mattenarle10/markamd)
  reported 513 stars. All 62 [public releases](https://api.github.com/repos/mattenarle10/markamd/releases?per_page=100)
  totaled 40,859 asset downloads, supporting the resume's 40k+ downloads and
  500+ stars. These are release-asset downloads, not unique users or installations.
- The portfolio's counter reported 33,886 downloads because its helper totals
  only the latest 20 releases. The resume uses the all-release total.
- The [maintainer README](https://github.com/mattenarle10/markamd/blob/main/README.md)
  confirms macOS, Windows, Linux, live preview, diagrams, and AI context bundles.
- Technical writing is supported by Matt's public articles, including
  [EKS upgrades with Terraform](https://builder.aws.com/content/3KBjjFFsqRRlVV59rQoXRS2DBx6/upgrading-eks-with-terraform-control-plane-nodes-then-add-ons).
- BetterBacolod's 2,000+ monthly active users is Matt's reported analytics figure;
  it could not be independently verified from the public site.
- The AWS open-source block highlights verified merged contributions by
  `mattenarle10` to AWS Lambda Web Adapter: the
  [Node.js ZIP example (#875)](https://github.com/aws/aws-lambda-web-adapter/pull/875),
  [Bun/Hono container example (#876)](https://github.com/aws/aws-lambda-web-adapter/pull/876),
  and [Tokio security dependency update (#914)](https://github.com/aws/aws-lambda-web-adapter/pull/914).
  Open PRs are not described as merged contributions.
