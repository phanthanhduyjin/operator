import {
  mdiAccountCircleOutline,
  mdiClose,
  mdiDotsHorizontal,
  mdiServerNetwork,
  mdiWebBox,
  mdiWebpack,
} from '@mdi/js';
import React from 'react';

import authStore from '../-/authStore';
import g from '../global';
import { StyleSheet, Text, TouchableOpacity, View } from '../native/Rn';
import ActionButtons from '../shared/ActionButtons';
import Field from '../shared/Field';
import v from '../variables';

const s = StyleSheet.create({
  ProfileSignInItem: {
    backgroundColor: v.bg,
    marginBottom: 15,
    marginLeft: 15,
    borderRadius: v.borderRadius,
    paddingHorizontal: 15,
    width: 280,
  },
  ProfileSignInItem__last: {
    marginRight: 15,
  },
  ProfileSignInItem__empty: {
    height: '70%',
    minHeight: 320,
    marginVertical: 45,
    marginLeft: 15,
    padding: 15,
  },
  ProfileSignInItem_Btns: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  ProfileSignInItem_EmptyTitle: {
    fontWeight: 'bold',
    fontSize: v.fontSizeSubTitle,
  },
});

const ProfileSignInItem = p =>
  p.empty ? (
    <View style={[s.ProfileSignInItem, s.ProfileSignInItem__empty]}>
      <Text style={[s.ProfileSignInItem_EmptyTitle]}>No server</Text>
      <Text>There is no server created</Text>
      <Text>Tap the below button to create one</Text>
      <View style={s.ProfileSignInItem_Btns}>
        <ActionButtons
          onSaveBtnPress={g.goToProfileCreate}
          saveText="CREATE NEW SERVER"
        />
      </View>
    </View>
  ) : (
    <View style={[s.ProfileSignInItem, p.last && s.ProfileSignInItem__last]}>
      <TouchableOpacity onPress={() => g.goToProfileUpdate(p.id)}>
        <Field
          name="USERNAME"
          value={p.pbxUsername}
          icon={mdiAccountCircleOutline}
        />
        <Field name="TENANT" value={p.pbxTenant} icon={mdiWebpack} />
        <Field name="HOSTNAME" value={p.pbxHostname} icon={mdiWebBox} />
        <Field name="PORT" value={p.pbxPort} icon={mdiServerNetwork} />
      </TouchableOpacity>
      <Field
        type="Switch"
        name="PUSH NOTIFICATION"
        value={p.pushNotificationEnabled}
        onValueChange={v =>
          authStore.upsertProfile({ id: p.id, pushNotificationEnabled: v })
        }
      />
      <Field
        type="Switch"
        name="UC"
        value={p.ucEnabled}
        onValueChange={v => authStore.upsertProfile({ id: p.id, ucEnabled: v })}
      />
      <View style={s.ProfileSignInItem_Btns}>
        <ActionButtons
          onBackBtnPress={() => authStore.removeProfile(p.id)}
          backIcon={mdiClose}
          onRefreshBtnPress={() => g.goToProfileUpdate(p.id)}
          refreshIcon={mdiDotsHorizontal}
          onSaveBtnPress={() => authStore.signIn(p.id)}
          saveText="SIGN IN"
        />
      </View>
    </View>
  );

export default ProfileSignInItem;
