Deploy DocuSeal on Fly.io

1. Install and login
- brew install flyctl
- flyctl auth login

2. Create app and volume
- flyctl apps create docuseal-wholesale-ai
- flyctl volumes create docuseal_data --size 10 --region ord --app docuseal-wholesale-ai

3. Deploy
- cd infra/docuseal-fly
- flyctl deploy -a docuseal-wholesale-ai

4. Open
- flyctl open -a docuseal-wholesale-ai

