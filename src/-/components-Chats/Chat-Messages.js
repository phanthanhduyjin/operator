import { mdiCheck, mdiClose } from '@mdi/js';
import {
  Body,
  Button,
  Content,
  Left,
  ListItem,
  Text,
  Thumbnail,
  View,
} from 'native-base';
import React from 'react';
import Progress from 'react-native-progress-circle';

import Icon from '../../shared/Icon';
import { std } from '../styleguide';
import Scroll from './Scroll';

const File = p => (
  <View>
    <View>
      <Text>{p.name}</Text>
      <Text>{p.size}</Text>
    </View>
    {p.state === 'waiting' && (
      <Button onPress={p.reject}>
        <Icon path={mdiClose} />
      </Button>
    )}
    {p.incoming && p.state === 'waiting' && (
      <Button onPress={p.accept}>
        <Icon path={mdiCheck} />
      </Button>
    )}
    {p.state === 'started' && (
      <Button onPress={p.reject}>
        <Progress
          percent={p.state === 'percent'}
          radius={std.iconSize.md}
          borderWidth={1 * 2}
          color={std.color.notice}
          shadowColor={std.color.shade4}
          bgColor={std.color.shade0}
        >
          <Icon path={mdiClose} />
        </Progress>
      </Button>
    )}
    {p.state === 'success' && <Text>Success</Text>}
    {p.state === 'failure' && <Text>Failed</Text>}
    {p.state === 'stopped' && <Text>Canceled</Text>}
  </View>
);

const Chat = p => (
  <Scroll>
    <ListItem chat>
      <Left>
        <Thumbnail source={{ uri: p.creatorAvatar }} />
      </Left>
      <Body>
        <View>
          <Text>{p.creatorName}</Text>
          <Text note>{p.created}</Text>
        </View>
        {!!p.text && <Text numberOfLines={999}>{p.text}</Text>}
        {!!p.file && (
          <File
            {...p.file}
            accept={() => p.acceptFile(p.file)}
            reject={() => p.rejectFile(p.file)}
          />
        )}
      </Body>
    </ListItem>
  </Scroll>
);

class ChatMessages extends React.Component {
  render() {
    const p = this.props;
    return (
      <Content>
        {p.ids.map((id, index) => (
          <Chat
            key={id}
            {...p.resolve(id, index)}
            acceptFile={p.acceptFile}
            rejectFile={p.rejectFile}
          />
        ))}
      </Content>
    );
  }
}

export default ChatMessages;
