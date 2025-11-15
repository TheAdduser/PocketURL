import random
import string

def generate_short_url():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

