from dotenv import load_dotenv

load_dotenv()

import os
import requests
import logging
from bullmq import Worker, Job
from screener.screener import screen_stocks, Screener
import asyncio

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("worker")


def save_screener(screener_id: str, screener: Screener):
    csv_str = screener.df.to_csv()
    payload = {
        "name": screener.name,
        "csv": csv_str,
        "screener": screener.screener,
        "explanation": screener.explanation,
        "filter_conditions": screener.filter_conditions,
        "tickers": screener.tickers,
    }

    api_endpoint = os.getenv("SCREENER_API_URL")
    requests.post(api_endpoint + "/api/updateScreener/" + screener_id, json=payload)


async def process(job: Job, *args, **kwargs):
    user_request = job.data["screenerData"]["userRequest"]
    screener_request = user_request["screenerPrompt"]
    screener = await screen_stocks(screener_request)
    save_screener(job.data["id"], screener)

    return


worker = Worker(
    "stockScreener",
    process,
    {
        "lockDuration": 5 * 60 * 1000,
        "autorun": False,
        "connection": "redis://localhost:6380",
    },
)

loop = asyncio.get_event_loop()


try:
    logger.info("Running worker...")
    asyncio.ensure_future(worker.run())
    loop.run_forever()
except:
    logger.info("Exiting worker...")
    asyncio.ensure_future(worker.close())
    while worker.closing:
        logger.info("Waiting for worker to close...")
        pass
    logger.info("Exited worker")
