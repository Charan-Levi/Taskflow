FROM python:3.12-slim AS runner

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir  -r requirements.txt

COPY app ./app

RUN useradd --create-home --uid 1001 appuser

USER appuser

EXPOSE 8000
#
ENTRYPOINT [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" ]