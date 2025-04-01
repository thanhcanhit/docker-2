from flask import Flask, render_template_string, request
import redis
import os

app = Flask(__name__)
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

# HTML template đơn giản
vote_form = """
    <h1>Vote for your favorite!</h1>
    <form method="POST">
        <input type="radio" name="vote" value="Cats"> Cats<br>
        <input type="radio" name="vote" value="Dogs"> Dogs<br>
        <input type="submit" value="Vote">
    </form>
"""

@app.route('/', methods=['GET', 'POST'])
def vote():
    if request.method == 'POST':
        vote = request.form.get('vote')
        if vote:
            redis_client.lpush('votes', vote)
            return "Thanks for voting!"
    return render_template_string(vote_form)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)