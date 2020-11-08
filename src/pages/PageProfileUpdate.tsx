import { observer } from 'mobx-react'
import React, { FC } from 'react'

import ProfileCreateForm from '../components/ProfileCreateForm'
import intl from '../stores/intl'
import Nav from '../stores/Nav'
import profileStore, { Profile } from '../stores/profileStore'

const PageProfileUpdate: FC<{
  id: string
}> = observer(props => (
  <ProfileCreateForm
    onBack={Nav().backToPageProfileSignIn}
    onSave={(p: Profile) => {
      profileStore.upsertProfile(p)
      Nav().backToPageProfileSignIn()
    }}
    title={intl`Update Account`}
    updatingProfile={profileStore.profilesMap[props.id]}
  />
))

export default PageProfileUpdate
