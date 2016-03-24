LoginButtons = React.createClass({
  getInitialState() {
    return {
      error: false,
      errorMessage: null,
      resetPassword: false,
      createAccount: false,
    }
  },

  createAccount(e) {
    e.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();
    var emailRegex = new RegExp("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$", 'i');
    if(emailRegex.test(email)){
      if(password.length >= 6){
        Accounts.createUser({
          email: email,
          password: password
        }, function(error){
          if(error) {
            this.setState({
              error: true,
              errorMessage: error.reason
            });
          }
  				else {
            Meteor.loginWithPassword(email, password);
            if(FlowRouter._current.path == "/") FlowRouter.go('/estimations');
          }
        });
      }
      else {
        this.setState({
          error: true,
          errorMessage: "Password must be at least 6 characters long"
        });
      }
    }
    else {
      this.setState({
        error: true,
        errorMessage: "Invalid email"
      });
    }
  },

  handleSignUpLink() {
    this.setState({createAccount: true});
  },

  handleResetPasswordLink() {
    this.setState({resetPassword: true});
  },

  handleLogIn(e) {
    e.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();
    var component = this;
    Meteor.loginWithPassword(email, password, function(error){
      if(error != undefined){
      	component.setState({
          error: true,
          errorMessage: error.reason
        });
      }
      else {
        if(FlowRouter._current.path == "/") FlowRouter.go('/estimations');
      }
		});
  },

  handleBack() {
    this.setState({
      createAccount: false,
      resetPassword: false,
      error: false
    });
  },

  renderFormControls() {
    if(this.state.resetPassword) return(
      <div className="reset-password">
        <button className="btn btn-primary login-button-form-submit col-xs-12 col-sm-12" id="login-buttons-forgot-password">Reset password</button>
        <button id="back-to-login-link" className="btn btn-default col-xs-12 col-sm-12" onClick={this.handleBack}>Cancel</button>
      </div>
    );

    if(this.state.createAccount) return(
      <div className="create-account">
        <input id="login-password" type="password" className="form-control" name="password" placeholder="Password"/>
        <button className="btn btn-primary col-xs-12 col-sm-12" id="login-buttons-password" type="button" onClick={this.createAccount}>Create</button>
        <button id="back-to-login-link" className="btn btn-default col-xs-12 col-sm-12" onClick={this.handleBack}>Cancel</button>
      </div>
    );
    return(
      <div className="login">
        <input id="login-password" type="password" className="form-control" name="password" placeholder="Password"/>
        <input id="login-button" type="submit" className="btn btn-primary col-xs-12 col-sm-12" value="Sign in"/>
        <div id="login-other-options">
          <a id="forgot-password-link" className="pull-left" onClick={this.handleResetPasswordLink}>Forgot password?</a>
          <a id="signup-link" className="pull-right" onClick={this.handleSignUpLink}>Create account</a>
        </div>
      </div>
    );
  },

  render() {
    return(
      <form className="register form-group" onSubmit={this.handleLogIn}>
  			{this.state.error ? <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div> : ""}
          <input id="login-email" type="email" className="form-control" name="email" placeholder="Email"/>
          {this.renderFormControls()}
      </form>
    );
  }
});
