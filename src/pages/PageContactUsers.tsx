import { mdiMagnify, mdiPhone, mdiVideo } from '@mdi/js'
import orderBy from 'lodash/orderBy'
import uniq from 'lodash/uniq'
import { observer } from 'mobx-react'
import React from 'react'

import UserItem from '../components/ContactUserItem'
import Field from '../components/Field'
import Layout from '../components/Layout'
import { RnTouchableOpacity } from '../components/Rn'
import authStore from '../stores/authStore'
import callStore from '../stores/callStore'
import chatStore, { ChatMessage } from '../stores/chatStore'
import contactStore from '../stores/contactStore'
import intl from '../stores/intl'
import Nav from '../stores/Nav'
import profileStore from '../stores/profileStore'
import DelayFlag from '../utils/DelayFlag'

@observer
class PageContactUsers extends React.Component {
  displayOfflineUsers = new DelayFlag()

  componentDidMount() {
    this.componentDidUpdate()
  }
  componentDidUpdate() {
    if (
      this.displayOfflineUsers.enabled !==
      authStore.currentProfile.displayOfflineUsers
    ) {
      this.displayOfflineUsers.setEnabled(
        authStore.currentProfile.displayOfflineUsers,
      )
    }
  }

  getMatchUserIds() {
    const userIds = uniq([
      ...contactStore.pbxUsers.map(u => u.id),
      ...contactStore.ucUsers.map(u => u.id),
    ])
    return userIds.filter(this.isMatchUser)
  }
  resolveUser = (id: string) => {
    const pbxUser = contactStore.getPBXUser(id) || {}
    const ucUser = contactStore.getUCUser(id) || {}
    const u = {
      ...pbxUser,
      ...ucUser,
    }
    return u
  }
  isMatchUser = (id: string) => {
    if (!id) {
      return false
    }
    let userId = id
    let pbxUserName: string
    const pbxUser = contactStore.getPBXUser(id)
    if (pbxUser) {
      pbxUserName = pbxUser.name
    } else {
      pbxUserName = ''
    }
    let ucUserName: string
    const ucUser = contactStore.getUCUser(id)
    if (ucUser) {
      ucUserName = ucUser.name
    } else {
      ucUserName = ''
    }
    //
    userId = userId.toLowerCase()
    pbxUserName = pbxUserName.toLowerCase()
    ucUserName = ucUserName.toLowerCase()
    const txt = contactStore.usersSearchTerm.toLowerCase()
    return (
      userId.includes(txt) ||
      pbxUserName.includes(txt) ||
      ucUserName.includes(txt)
    )
  }

  getLastMessageChat = (id: string) => {
    const chats = chatStore.messagesByThreadId[id] || []
    return chats.length !== 0 ? chats[chats.length - 1] : ({} as ChatMessage)
  }

  render() {
    const allUsers = this.getMatchUserIds().map(this.resolveUser)
    const onlineUsers = allUsers.filter(i => i.status && i.status !== 'offline')
    type User = typeof allUsers[0]

    const { ucEnabled } = authStore.currentProfile
    const displayUsers =
      !this.displayOfflineUsers.enabled && ucEnabled ? onlineUsers : allUsers

    const map = {} as { [k: string]: User[] }
    displayUsers.forEach(u => {
      u.name = u.name || u.id || ''
      let c0 = u.name.charAt(0).toUpperCase()
      if (!/[A-Z]/.test(c0)) {
        c0 = '#'
      }
      if (!map[c0]) {
        map[c0] = []
      }
      map[c0].push(u)
    })

    let groups = Object.keys(map).map(k => ({
      key: k,
      users: map[k],
    }))
    groups = orderBy(groups, 'key')
    groups.forEach(g => {
      g.users = orderBy(g.users, 'name')
    })

    return (
      <Layout
        description={(() => {
          let desc = intl`PBX users, ${allUsers.length} total`
          if (allUsers.length && ucEnabled) {
            desc = desc.replace('PBX', 'PBX/UC')
            desc = desc.replace(
              intl`${allUsers.length} total`,
              intl`${onlineUsers.length}/${allUsers.length} online`,
            )
          }
          return desc
        })()}
        menu='contact'
        subMenu='users'
        title={intl`Users`}
      >
        <Field
          icon={mdiMagnify}
          label={intl`SEARCH FOR USERS`}
          onValueChange={(v: string) => {
            contactStore.usersSearchTerm = v
          }}
          value={contactStore.usersSearchTerm}
        />
        {ucEnabled && (
          <Field
            label={intl`SHOW OFFLINE USERS`}
            onValueChange={(v: boolean) => {
              profileStore.upsertProfile({
                id: authStore.signedInId,
                displayOfflineUsers: v,
              })
            }}
            type='Switch'
            value={authStore.currentProfile.displayOfflineUsers}
          />
        )}
        {groups.map(_g => (
          <React.Fragment key={_g.key}>
            <Field isGroup label={_g.key} />
            {_g.users.map((u, i) => (
              <RnTouchableOpacity
                key={i}
                onPress={
                  authStore.currentProfile.ucEnabled
                    ? () => Nav().goToPageChatDetail({ buddy: u.id })
                    : undefined
                }
              >
                <UserItem
                  iconFuncs={[
                    () => callStore.startVideoCall(u.id),
                    () => callStore.startCall(u.id),
                  ]}
                  icons={[mdiVideo, mdiPhone]}
                  lastMessage={this.getLastMessageChat(u.id)?.text}
                  {...u}
                />
              </RnTouchableOpacity>
            ))}
          </React.Fragment>
        ))}
      </Layout>
    )
  }
}

export default PageContactUsers
