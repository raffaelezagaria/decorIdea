import dbm
from flask import Flask, render_template, url_for, redirect, session
from flask_sqlalchemy import SQLAlchemy
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from flask_wtf import FlaskForm
from flask_bootstrap import Bootstrap
from wtforms.validators import InputRequired, Email, Length, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user


app= Flask (__name__)
app.config['SECRET_KEY']= 'segretino'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
Bootstrap(app)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin, db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(15), unique=True)
	email = db.Column(db.String(50), unique= True)
	password = db.Column(db.String(80))
    
	
@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))

class LoginForm(FlaskForm):
	username = StringField ('username', validators=[InputRequired(), Length(min=4, max=15)])
	password = PasswordField('password', validators =[InputRequired(), Length(min=4, max=15)])
	remember = BooleanField ('remember me')
	submit = SubmitField ("Submit")
	
	
class RegisterForm(FlaskForm):
	email = StringField('email', validators=[InputRequired(), Email(message='Invalid email!'), Length(max=50)])
	username = StringField ('username', validators=[InputRequired(), Length(min=4, max=15)])
	password = PasswordField('password', validators =[InputRequired(), Length(min=4, max=15)])
	submit = SubmitField ("Submit")
	
	def validate_email(self, email):
									alrexi_email = User.query.filter_by(email=email.data).first()
									if alrexi_email:
											raise ValidationError("Email già esistente. Sceglitene un'altra")
										
										
	def validate_username(self, username):
						alrexi_username = User.query.filter_by(username=username.data).first()
						if alrexi_username:
								raise ValidationError("Username già esistente. Sceglitene un altro")
	


@app.route('/home')
def home():
	return render_template('decoridea.html')




@app.route('/login', methods=['GET', 'POST'])
def login():
	form = LoginForm()
	
	if form.validate_on_submit():
		user= User.query.filter_by(username=form.username.data).first()
		if user:
			if check_password_hash(user.password, form.password.data):
				login_user(user, remember=form.remember.data)
				return redirect(url_for('home'))
			
	return render_template('login.html', form=form)


@app.route('/register',methods=['GET', 'POST'])
def register():
	form = RegisterForm()
	
	if form.validate_on_submit():
		hashed_password = generate_password_hash(form.password.data, method='sha256')
		new_user = User(username=form.username.data, email=form.email.data, password=hashed_password)
		db.session.add(new_user)
		db.session.commit()
		return redirect(url_for('login'))
		
	return render_template('register.html',form=form)



@app.route('/contvendor')
@login_required
def contvendor():
	return render_template('contvendor.html',name= current_user.username)
	


@app.route('/kitchen')
@login_required
def kitchen():
	return render_template('kitchen.html',name= current_user.username)

@app.route('/bedroom')
@login_required
def bedroom():
	return render_template('bedroom.html',name= current_user.username)

@app.route('/bathroom')
@login_required
def bathroom():
	return render_template('bathroom.html',name= current_user.username)

@app.route('/living')
@login_required
def living():
	return render_template('living.html',name= current_user.username)

@app.route('/contact')
def contact():
	return render_template('contact.html')

@app.route('/logout')
@login_required
def logout():
	session.clear()
	logout_user()
	return redirect(url_for('home'))



	
if __name__== '__main__':
	app.run(debug=True)