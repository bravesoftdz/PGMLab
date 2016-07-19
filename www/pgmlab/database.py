from sqlalchemy import create_engine
engine = create_engine("sqlite:///pgmlab.db", echo_pool=True)

from sqlalchemy.orm import sessionmaker, scoped_session, relationship
Session = sessionmaker(bind=engine, autoflush=False)
db_session = scoped_session(Session)

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
Base.query = db_session.query_property()

from sqlalchemy import Column, String, Integer, Float, null, ForeignKey
class Task(Base):
    __tablename__ = "tasks"
    task_id = Column("task_id", String, primary_key=True)
    task_type = Column("task_type", String)
    submit_datetime = Column("submit_datetime", String) #can add other datetimes for task info (i.e. runtime, waittime, etc)
    status = Column("status", String)
    # Job metadata (i.e. parameters for different runs) causes unnormalized table (should be decoupled at some point)
    pi_filename = Column("pi_filename", String)
    obs_filename = Column("obs_filename", String)
    number_states = Column("number_states", Integer)
    # Learning
    max_iterations = Column("max_iterations", Integer, default=null())
    change_limit = Column("change_limit", Float, default=null())
    # Inference
    lfg_filename = Column("lfg_filename", String, default=null())

    # USERS
    user_sub = Column("user_sub", String, ForeignKey("users.sub"))
    user = relationship("User", back_populates="tasks")

    def to_dict(self):
        return {
            "task_id": self.task_id,
            "task_type": self.task_type,
            "submit_datetime": self.submit_datetime,
            "status": self.status,
            "pi_filename": self.pi_filename,
            "obs_filename": self.obs_filename,
            "number_states": self.number_states,
            "max_iterations": self.max_iterations if self.task_type=="learning" else None,
            "change_limit": self.change_limit if self.task_type=="learning" else None,
            "lfg_filename": self.lfg_filename if self.task_type=="inference" else None
        }

class User(Base):
    __tablename__ = "users"
    sub = Column("sub", String, primary_key=True) # 'sub' field of id_token from Google
    name = Column("name", String)
    email = Column("email", String)
    tasks = relationship("Task", order_by=Task.submit_datetime, back_populates="users")


Base.metadata.create_all(engine)

class DatabaseSessionManager():
    def __init__(self):
        self.session = scoped_session(Session)
        print(self.session)

    def get_all_tasks(self):
        return self.session.query(Task).all()

    def add_task(self, task):
        print("...[db] adding task: {}".format(task.to_dict()["task_id"]))
        self.session.add(task)
        self.commit_session()

    def update_task(self, task_id, status):
        print("...[db] updating task ({0}): {1}".format(status, task_id))
        task = self.session.query(Task).get(task_id)
        task.status = status
        self.commit_session()

    def commit_session(self):
        try:
            print("...[db] committing session")
            self.session.commit()
        except:
            print("...[db] rolling back session")
            self.session.rollback()
