import asyncio
import pythrust

loop = asyncio.get_event_loop()
api = pythrust.API(loop)

url = 'file:///home/cairns/workspace/manga-reader/index.html'

asyncio.async(api.spawn())
asyncio.async(api.window({'root_url': url}).show())

loop.run_forever()

api.window.remote('SOME MESSAGE!')
