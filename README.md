# dummy-app

A tiny Express app for testing a GitHub Actions pipeline that runs tests, SSHes into an EC2 instance, builds a Docker image there, and runs the container.

## Endpoints

| Route | Description |
|---|---|
| `GET /` | Welcome message + deployed version (git SHA) |
| `GET /health` | Health check |
| `GET /api/greet/:name` | Returns a greeting |
| `GET /api/sum?a=1&b=2` | Adds two numbers |

## Run locally

```bash
npm ci
npm test
npm start                      # http://localhost:3000

docker build -t dummy-app .
docker run -p 3000:3000 dummy-app
```

## One-time EC2 setup

1. Launch an instance (Ubuntu 22.04/24.04 or Amazon Linux 2023).
2. Security group inbound rules: **22** (SSH, GitHub runners need it, so 0.0.0.0/0 for testing) and **80** (HTTP).
3. Install Docker and curl, and let your user run Docker without sudo:

   Ubuntu:
   ```bash
   sudo apt-get update && sudo apt-get install -y docker.io curl
   sudo systemctl enable --now docker
   sudo usermod -aG docker ubuntu
   ```
   Amazon Linux 2023:
   ```bash
   sudo dnf install -y docker
   sudo systemctl enable --now docker
   sudo usermod -aG docker ec2-user
   ```
   Log out and back in (or reboot) so the group change takes effect. Check with `docker ps`.

## GitHub secrets

Repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `EC2_HOST` | Public IP or DNS of the instance |
| `EC2_USER` | `ubuntu` (Ubuntu) or `ec2-user` (Amazon Linux) |
| `EC2_SSH_KEY` | Full contents of the `.pem` key file, including the BEGIN/END lines |

## Pipeline

- **Pull request to `main`** → install, test, verify the image builds. No deploy.
- **Push to `main`** (or manual run) → tests, then copy source to EC2 over SCP, `docker build`, replace the running container, wait for `/health`, prune old images.

After a deploy, open `http://<EC2_HOST>/` and the `version` field should match the commit SHA.
