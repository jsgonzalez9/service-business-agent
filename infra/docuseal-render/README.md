Deploy DocuSeal on Render

Blueprint deploy (recommended)
- Connect this repo in Render
- Choose Blueprint and select infra/docuseal-render/render.yaml
- Render will create the web service and a persistent disk

Manual deploy
- New → Web Service → Use Docker
- Repository path: infra/docuseal-render
- Set Environment Variable PORT=3000
- Add Persistent Disk: name docuseal-data, mount path /data, size 10GB
- Deploy; the service URL becomes your DOCUSEAL_BASE_URL

App configuration
- Set DOCUSEAL_BASE_URL to the Render URL
- Set DOCUSEAL_API_TOKEN from DocuSeal Settings
- Configure webhook to https://<your-app-domain>/api/sign/ds/webhook
