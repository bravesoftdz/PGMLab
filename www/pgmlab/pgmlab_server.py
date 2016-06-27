from twisted.web.static import File
import os, os.path
cwd = os.getcwd()
inference_path = cwd+"/../../data/pgmlab/inference/"
learning_path = cwd+"/../../data/pgmlab/learning/"
import pprint
pp = pprint.PrettyPrinter(indent=4)
from itertools import * # for skipping lines in a file
import datetime, shutil, json, string, cgi, uuid

# PGMLab related modules
import pgmlab_commands
from pgmlab_db import db_session, Task

# Klein for POST that starts Celery task
from klein import Klein
klein = Klein()
# For communicating with backend (db, RPC, Pub/Sub)
from autobahn.twisted.wamp import Application
wamp = Application()
# Queue and run tasks async
from celery import Celery
celery = Celery("pgmlab_server", backend="amqp", broker="amqp://guest@localhost//") # celery -A pgmlab_server.celery worker
celery.conf.CELERY_SEND_EVENTS = True

# RPC to register a wamp.publish on <App> mount (loop over all users in db)
@wamp.register("celery.tasks")
def get_all_tasks():
    tasks = db_session.query(Task).all()
    tasks_dict = {}
    for task in tasks:
        tasks_dict[task.task_id] = task.to_dict()
    return tasks_dict

# LEARNING
import time
@celery.task(bind=True)
def run_learning_task(self, **kwargs):
    # print "run_learning_task"
    # pp.pprint(kwargs)
    task_id = self.request.id
    time.sleep(10)
    # pgmlab stuff
@klein.route('/run/learning/submit', methods=["POST"])
def run_learning_submit(request):
    pi_file = request.args["learningPairwiseInteractionFile"][0]
    obs_file = request.args["learningObservationFile"][0]
    number_states = int(request.args["learningNumberOfStates"][0])
    log_likelihood_change_limit = request.args["logLikelihoodChangeLimit"][0]
    em_max_iterations = request.args["emMaxIterations"][0]
    data = {
        "pi_file": pi_file,
        "obs_file": obs_file,
        "number_states": number_states,
        "change_limit": log_likelihood_change_limit,
        "max_iterations": em_max_iterations,
        "task_type": "learning",
        "submit_datetime": str(datetime.datetime.now())
    }
    task = run_learning_task.apply_async(kwargs=data)
    return task.id

# INFERENCE
@celery.task(bind=True)
def run_inference_task(self, **kwargs):
    print "run_inference_task"
    pp.pprint(kwargs)
@klein.route('/run/inference/submit', methods=["POST"])
def run_inference_submit(request):
    pi_file = request.args["inferencePairwiseInteractionFile"][0]
    obs_file = request.args["inferenceObservationFile"][0]
    fg_file = request.args["learntFactorgraphFile"][0]
    number_states = int(request.args["inferenceNumberOfStates"][0])
    data = {
        "pi_file": pi_file,
        "obs_file": obs_file,
        "fg_file": fg_file,
        "number_states": number_states,
        "task_type": "inference",
        "submit_datetime": str(datetime.datetime.now())
    }
    task = run_inference_task.apply_async(kwargs=data)
    return task.id

if __name__ == "__main__":
    from celery_monitor import MonitorThread
    MonitorThread(celery, wamp)
    
    from twisted.web.server import Site
    from twisted.internet import reactor
    reactor.listenTCP(9002, Site(klein.resource()))
    wamp.run(u"ws://localhost:9001/ws", u"realm1")