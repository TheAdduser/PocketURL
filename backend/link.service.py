import string
import hashlib

BASE62 = string.digits + string.ascii_letters
MAX_SHORT_URL_LENGHT = 8


def shorten(logn_url: str) -> str:
    digest = hashlib.sha256(logn_url.encode("utf-8")).digest()
    num = int.from_bytes(digest, "big")

    # Encode to Base62
    out = []
    for _ in range(MAX_SHORT_URL_LENGHT):
        num, r = divmod(num, 62)
        out.append(BASE62[r])

    return "".join(out)

print(shorten('https://github.com'))
