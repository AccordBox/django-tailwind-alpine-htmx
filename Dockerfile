FROM python:3.9-buster as python-builder

# Install operating system dependencies.
RUN apt-get update -y && \
    apt-get install -y apt-transport-https rsync gettext libgettextpo-dev && \
    curl -sL https://sentry.io/get-cli/ | bash && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements.
COPY requirements.txt .
RUN pip install -r requirements.txt

#############################################################################
FROM node:16-alpine as frontend-builder

# we copy python 3-party packages here so Tailwind PurgeCSS can work as expected
COPY --from=python-builder /usr/local/lib/python3.9/site-packages /py-site-packages/
ARG pySitePackages=/py-site-packages/

WORKDIR /app
COPY . .

WORKDIR /app/frontend
RUN npm install
RUN npm run build

#############################################################################
FROM python:3.9-buster

# Install operating system dependencies.
RUN apt-get update -y && \
    apt-get install -y apt-transport-https rsync gettext libgettextpo-dev && \
    curl -sL https://sentry.io/get-cli/ | bash && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements.
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install gunicorn==20.0.4 && \
    pip install whitenoise==5.3.0 && \
    pip install dj-database-url==0.5.0 && \
    pip install psycopg2-binary==2.8.6

# Copy application code.
COPY . .

COPY --from=frontend-builder /app/frontend/build/ /app/frontend/build/

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    DJANGO_SETTINGS_MODULE=django_tailwind_app.settings \
    PORT=8000 \
    WEB_CONCURRENCY=3 \
    GUNICORN_CMD_ARGS="--max-requests 1200 --access-logfile -"

EXPOSE 8000

# Install assets
RUN SECRET_KEY=none DJANGO_DEBUG=0 django-admin collectstatic -v 2 --noinput --clear

# Run application
CMD gunicorn django_tailwind_app.wsgi:application
