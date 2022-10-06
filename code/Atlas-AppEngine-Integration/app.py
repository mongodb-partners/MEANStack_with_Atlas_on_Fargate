from flask import Flask, render_template, request
import pymongo
import configparser

parser = configparser.ConfigParser()
parser.read("config.txt")
app = Flask(__name__)

myclient = pymongo.MongoClient(parser.get("config", "uri"), tlsAllowInvalidCertificates=True)
mydb = myclient["AppEngineTest"]
mycol = mydb["Employee"]


@app.route("/")
def homepage():
    return render_template("index.html")


@app.route("/submit", methods=['GET'])
def docs():
    args = request.args
    x = mycol.insert_one({"Name": args["fname"], "Surname": args["lname"], "phone":args["phone"]})
    if x.acknowledged:
        return render_template("success.html", Names="Data Interested Successfully")
    return render_template("success.html", Names="Data Insertion Failed !!!!!!")


@app.route("/find", methods=['GET'])
def find():
    args = request.args
    print("Hello World !!!!!")
    x = mycol.find_one({"Name": args["find"]})
    print(x.values())

    return render_template("find.html", Names=x.items())


if __name__ == "__main__":
    app.run(debug=True, port=8000)