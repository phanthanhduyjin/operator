import { mdiKeyboardBackspace, mdiPlus } from '@mdi/js';
import { observer } from 'mobx-react';
import React from 'react';

import g from '../global';
import authStore from '../global/authStore';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from '../native/Rn';
import { useAnimation } from '../utils/animation';
import HeaderNavigation from './HeaderNavigation';
import Icon from './Icon';

const css = StyleSheet.create({
  LayoutHeader: {
    position: `absolute`,
    top: 0,
    left: 0,
    right: 0,
  },
  LayoutHeader_Inner: {
    padding: 15,
    backgroundColor: g.bg,
  },
  LayoutHeader_Inner__compact: {
    ...g.boxShadow,
  },
  LayoutHeader_Inner__hasBackBtn: {
    paddingLeft: 50,
  },
  LayoutHeader_Inner__transparent: {
    backgroundColor: `transparent`,
  },
  LayoutHeader_Title: {
    fontSize: g.fontSizeTitle,
    lineHeight: g.lineHeightTitle,
    fontWeight: `bold`,
  },
  LayoutHeader_Description: {
    color: g.subColor,
  },
  LayoutHeader_Description__compact: {
    display: `none`,
  },
  LayoutHeader_CreateBtn: {
    position: `absolute`,
    top: 0,
    right: 5,
  },
  LayoutHeader_CreateBtnOuter: {
    position: `absolute`,
    top: 11,
    right: 0,
    width: 50,
    height: 50,
    overflow: `hidden`,
  },
  LayoutHeader_CreateBtnInner: {
    position: `absolute`,
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: g.mainDarkBg,
  },
  LayoutHeader_CreateBtn__white: {
    backgroundColor: g.bg,
  },
  LayoutHeader_BackBtn: {
    position: `absolute`,
    top: 0,
    left: 0,
  },
  LayoutHeader_BackBtnInner: {
    position: `absolute`,
    top: 0,
    left: 0,
    width: 50,
    height: 70,
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderRadius: 0,
  },
  LayoutHeader_Conn: {
    backgroundColor: g.warningD,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  LayoutHeader_Conn__failure: {
    backgroundColor: g.redDarkBg,
  },
});

const Header = observer(props => {
  const a = useAnimation(props.compact, {
    headerInnerPaddingVertical: [15, 10],
    titleFontSize: [g.fontSizeTitle, g.fontSizeSubTitle],
    titleLineHeight: [g.lineHeightTitle, 20],
    createBtnOuterTop: [11, 0],
    createBtnOuterHeight: [50, 40],
    createBtnInnerTop: [0, -5],
    backBtnHeight: [70, 40],
    backBtnPadding: [20, 5],
    navigationTop: [90, 40],
  });

  const { isConnFailure, shouldShowConnStatus } = authStore;
  const connA = useAnimation(shouldShowConnStatus, {
    height: [0, 20], // lineHeightSmall + paddingVertical
    opacity: [0, 1],
  });
  const {
    pbxConnectingOrFailure,
    sipConnectingOrFailure,
    ucConnectingOrFailure,
  } = authStore;
  let service = ``;
  if (pbxConnectingOrFailure) {
    service = `PBX`;
  } else if (sipConnectingOrFailure) {
    service = `SIP`;
  } else if (ucConnectingOrFailure) {
    service = `UC`;
  }
  const connMessage =
    service &&
    (isConnFailure
      ? `${service} connection failed`
      : `Connecting to ${service}`);

  return (
    <View style={[css.LayoutHeader]}>
      <StatusBar transparent={props.transparent} />
      {shouldShowConnStatus && (
        <Animated.View
          style={[
            css.LayoutHeader_Conn,
            isConnFailure && css.LayoutHeader_Conn__failure,
            {
              height: connA.height,
              opacity: connA.opacity,
            },
          ]}
        >
          <Text small white>
            {connMessage}
          </Text>
        </Animated.View>
      )}
      <Animated.View
        style={[
          css.LayoutHeader_Inner,
          props.compact && css.LayoutHeader_Inner__compact,
          !!props.onBackBtnPress && css.LayoutHeader_Inner__hasBackBtn,
          props.transparent && css.LayoutHeader_Inner__transparent,
          {
            paddingVertical: a.headerInnerPaddingVertical,
          },
        ]}
      >
        <Animated.Text
          style={[
            css.LayoutHeader_Title,
            {
              fontSize: a.titleFontSize,
              lineHeight: a.titleLineHeight,
              color: props.titleColor || `black`,
            },
          ]}
        >
          {props.compact ? props.titleCompact || props.title : props.title}
        </Animated.Text>
        <Text
          style={[
            css.LayoutHeader_Description,
            props.compact && css.LayoutHeader_Description__compact,
          ]}
        >
          {props.description || `\u200a`}
        </Text>
        {props.onCreateBtnPress && (
          <TouchableOpacity
            onPress={props.onCreateBtnPress}
            style={css.LayoutHeader_CreateBtn}
          >
            <Animated.View
              style={[
                css.LayoutHeader_CreateBtnOuter,
                {
                  top: a.createBtnOuterTop,
                  height: a.createBtnOuterHeight,
                },
              ]}
            >
              <Animated.View
                style={[
                  css.LayoutHeader_CreateBtnInner,
                  props.transparent && css.LayoutHeader_CreateBtn__white,
                  {
                    top: a.createBtnInnerTop,
                  },
                ]}
              >
                <Icon
                  color={props.transparent ? `black` : `white`}
                  path={mdiPlus}
                />
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        )}
        {props.onBackBtnPress && (
          <TouchableOpacity
            onPress={props.onBackBtnPress}
            style={css.LayoutHeader_BackBtn}
          >
            <Animated.View
              style={[
                css.LayoutHeader_BackBtnInner,
                {
                  height: a.backBtnHeight,
                  paddingVertical: a.backBtnPadding,
                },
              ]}
            >
              <Icon color={props.backBtnColor} path={mdiKeyboardBackspace} />
            </Animated.View>
          </TouchableOpacity>
        )}
      </Animated.View>
      {props.navigation && <HeaderNavigation {...props.navigation} />}
    </View>
  );
});

export default Header;
