from services.link_service import shorten


def test_google():
    assert shorten("https://google.com") == "BgS8RrKb"
