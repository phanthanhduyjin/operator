import { observer } from 'mobx-react';
import React from 'react';

import authStore from '../../shared/authStore';
import routerStore from '../../shared/routerStore';
import Toast from '../../shared/Toast';
import { validateHostname, validatePort } from '../../shared/validator';
import UI from './ui';

@observer
class View extends React.Component {
  state = {
    ...authStore.getProfile(this.props.match.params.profile),
  };

  constructor(props) {
    super(props);
    this.state.pbxPhoneIndex = this.state.pbxPhoneIndex || '4';
  }
  componentDidUpdate(prevProps) {
    const id = this.props.match.params.profile;
    const prevId = prevProps.match.params.profile;
    if (id !== prevId) {
      this.setState({
        ...authStore.getProfile(id),
      });
    }
  }

  render() {
    return (
      <UI
        profile={this.state}
        setPBXHostname={this.setPBXHostname}
        setPBXPort={this.setPBXPort}
        setPBXTenant={this.setPBXTenant}
        setPBXUsername={this.setPBXUsername}
        setPBXPassword={this.setPBXPassword}
        setPBXPhoneIndex={this.setPBXPhoneIndex}
        setPBXTurnEnabled={this.setPBXTurnEnabled}
        setAddingPark={this.setAddingPark}
        submitAddingPark={this.submitAddingPark}
        setUCEnabled={this.setUCEnabled}
        setUCHostname={this.setUCHostname}
        setUCPort={this.setUCPort}
        removePark={this.removePark}
        save={this.save}
        back={routerStore.goToPageSignIn}
      />
    );
  }

  setPBXHostname = pbxHostname => {
    this.setState({
      pbxHostname,
    });
  };

  setPBXPort = pbxPort => {
    this.setState({
      pbxPort,
    });
  };

  setPBXTenant = pbxTenant => {
    this.setState({
      pbxTenant,
    });
  };

  setPBXUsername = pbxUsername => {
    this.setState({
      pbxUsername,
    });
  };

  setPBXPassword = pbxPassword => {
    this.setState({
      pbxPassword,
    });
  };

  setPBXPhoneIndex = pbxPhoneIndex => {
    this.setState({
      pbxPhoneIndex,
    });
  };

  setPBXTurnEnabled = pbxTurnEnabled => {
    this.setState({
      pbxTurnEnabled,
    });
  };

  _isStringEmpty = s => {
    return !s && 0 === s.length;
  };

  setUCEnabled = ucEnabled => {
    if (ucEnabled) {
      if (
        this._isStringEmpty(this.state.ucHostname) &&
        this._isStringEmpty(this.state.ucPort)
      ) {
        if (
          !this._isStringEmpty(this.state.pbxHostname) &&
          !this._isStringEmpty(this.state.pbxPort)
        ) {
          this.setUCHostname(this.state.pbxHostname);
          this.setUCPort(this.state.pbxPort);
        }
      }
    }

    this.setState({
      ucEnabled,
    });
  };

  setUCHostname = ucHostname => {
    this.setState({
      ucHostname,
    });
  };

  setUCPort = ucPort => {
    this.setState({
      ucPort,
    });
  };

  setAddingPark = addingPark => {
    this.setState({
      addingPark: addingPark.trim(),
    });
  };

  submitAddingPark = () => {
    const { addingPark, parks } = this.state;

    if (!addingPark) {
      return;
    }

    if (/[^a-z0-9_]/.test(addingPark)) {
      Toast.error('Invalid park number');
      return;
    }

    this.setState({
      parks: [addingPark, ...parks.filter(_ => _ !== addingPark)],
      addingPark: '',
    });
  };

  removePark = park => {
    this.setState(state => ({
      parks: state.parks.filter(_ => _ !== park),
    }));
  };

  missingRequired = () =>
    !this.state.pbxHostname ||
    !this.state.pbxPort ||
    !this.state.pbxUsername ||
    !this.state.pbxPassword ||
    (this.state.ucEnabled && (!this.state.ucHostname || !this.state.ucPort));

  save = () => {
    if (this.missingRequired()) {
      Toast.error('Missing required fields');
      return;
    }

    if (!validateHostname(this.state.pbxHostname)) {
      Toast.error('Host name is invalid');
      return;
    }

    if (!validatePort(this.state.pbxPort)) {
      Toast.error('Port is invalid');
      return;
    }

    const pbxHostname = this.state.pbxHostname.trim();
    const pbxPort = this.state.pbxPort.trim();
    const pbxTenant = this.state.pbxTenant.trim();
    const pbxUsername = this.state.pbxUsername.trim();
    const pbxPassword = this.state.pbxPassword.trim();
    const pbxPhoneIndex = this.state.pbxPhoneIndex || '4';
    const pbxTurnEnabled = this.state.pbxTurnEnabled;
    const ucHostname = this.state.ucHostname.trim();
    const ucPort = this.state.ucPort.trim();
    const parks = [];

    for (let i = 0; i < this.state.parks.length; i++) {
      parks.push(this.state.parks[i].trim());
    }

    authStore.upsertProfile({
      id: this.state.id,
      pbxHostname: pbxHostname,
      pbxPort: pbxPort,
      pbxTenant: pbxTenant,
      pbxUsername: pbxUsername,
      pbxPassword: pbxPassword,
      pbxPhoneIndex: pbxPhoneIndex,
      pbxTurnEnabled: pbxTurnEnabled,
      parks: parks,
      ucEnabled: this.state.ucEnabled,
      ucHostname: ucHostname,
      ucPort: ucPort,
    });

    routerStore.goToPageSignIn();
  };
}

export default View;
