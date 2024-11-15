import React, { createRef } from 'react'
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'

import { i18n } from '../i18n'
import { Util } from '../Util'

type UccacWidgetProps = {
  context: any
  operatorConsoleAsParent: any
  uccacWrapper: any
  uccacwidgetFgColor: string
  borderRadius: string
  uccacwidgetBgColor: string
  outsideShadow_spread: string
  outsideShadow_horizontalOffset: string
  outsideShadow_verticalOffset: string
  outsideShadow_blur: string
  outsideShadow_color: string
  insideShadow_horizontalOffset: string
  insideShadow_verticalOffset: string
  insideShadow_blur: string
  insideShadow_spread: string
  insideShadow_color: string
}

type UccacWidgetState = {
  isRestartButtonDisabled: boolean
}

export class UccacWidget extends React.Component<
  UccacWidgetProps,
  UccacWidgetState
> {
  durationTimeout = null
  _IsEditMode
  _OperatorConsoleAsParent
  _UccacWrapper
  _uccacAc
  _onUccacDeinitFunction
  _uccacRootElementRef
  _onUccacInitSuccessFunction

  constructor(props) {
    super(props)
    this._IsEditMode = !props.context
    this._OperatorConsoleAsParent = props.operatorConsoleAsParent
    this._UccacWrapper = props.uccacWrapper
    this.state = { isRestartButtonDisabled: false }
    this._uccacAc = null

    if (!this._IsEditMode) {
      this._uccacRootElementRef = createRef()
      const this_ = this
      this._onUccacInitSuccessFunction = function (uccacWrapperAsCaller) {
        this_._onInitUccacWrapperSuccessByUccacWrapper(uccacWrapperAsCaller)
      }
      this._UccacWrapper.addOnUccacInitSuccessFunction(
        this._onUccacInitSuccessFunction,
      )

      this._onUccacDeinitFunction = function (uccacWrapperAsCaller) {
        this_._onDeinitUccacWrapperByUccacWrapper(uccacWrapperAsCaller)
      }
      this._UccacWrapper.addOnUccacDeinitFunction(this._onUccacDeinitFunction)
    } else {
      this._uccacRootElementRef = null
    }
  }

  _refreshUccacAc() {
    if (this._UccacWrapper.isInitialized() === true) {
      this._initUccacAc()
    } else {
      this._destroyUccacAc()
    }
  }

  componentDidMount() {
    if (!this._IsEditMode) {
      this._refreshUccacAc()
    }
  }

  // componentDidUpdate() {
  // }

  componentWillUnmount() {
    if (!this._IsEditMode) {
      this._destroyUccacAc()
      this._UccacWrapper.removeOnUccacInitSuccessFunction(
        this._onUccacInitSuccessFunction,
      )
      this._UccacWrapper.removeOnUccacDeinitFunction(
        this._onUccacDeinitFunction,
      )
    }
  }

  _onInitUccacWrapperSuccessByUccacWrapper(uccacWrapperAsCaller) {
    this._initUccacAc()
  }

  _onDeinitUccacWrapperByUccacWrapper(uccacWrapperAsCaller) {
    this._destroyUccacAc()
  }

  _destroyUccacAc() {
    if (!this._uccacAc) {
      return false
    }
    this._uccacAc.destroy()
    this._uccacAc = null
    return true
  }

  _initUccacAc() {
    if (this._uccacAc) {
      this._uccacAc.destroy()
      this._uccacAc = null
    }

    const eUccacRoot = this._uccacRootElementRef.current
    const eWebchatqueue = eUccacRoot.querySelector('span[name="webchatqueue"]')
    const eWebchatpickup = eUccacRoot.querySelector(
      'span[name="webchatpickup"]',
    )
    const eSearch = eUccacRoot.querySelector('span[name="search"]')
    const eUcclientPanelRoot = eUccacRoot.querySelector(
      'div[name="ucclientPanelRoot"]',
    )

    this._uccacAc = this._UccacWrapper.addUccacAc()
    const initUccacAcOptions = {
      acIconParentsWebchatqueue: eWebchatqueue,
      acIconParentsWebchatpickup: eWebchatpickup,
      acIconParentsSearch: eSearch,
    }
    this._uccacAc.init(initUccacAcOptions)

    const startUCClientOptions = {
      ucclientWidgetParent: eUcclientPanelRoot,
      ucclientUcurl: this._UccacWrapper.getUcurl(),
      ucclientTenant: this._OperatorConsoleAsParent.getLoginTenantname(),
      ucclientUser: this._OperatorConsoleAsParent.getLoginUsername(),
      ucclientPass: this._OperatorConsoleAsParent.getLoginPassword(),
    }
    this.setState({ isRestartButtonDisabled: true }, () => {
      this._uccacAc.startUCClient(startUCClientOptions)
      setTimeout(() => {
        this.setState({ isRestartButtonDisabled: false })
      }, 8000)
    })
  }

  _onClickRestart() {
    const bConfirm = confirm(i18n.t('confirmRestartUccac'))
    if (!bConfirm) {
      return
    }

    this.setState({ isRestartButtonDisabled: true }, () => {
      this._uccacAc.stopUCClient()
      const eUccacRoot = this._uccacRootElementRef.current
      const eUcclientPanelRoot = eUccacRoot.querySelector(
        'div[name="ucclientPanelRoot"]',
      )
      const startUCClientOptions = {
        ucclientWidgetParent: eUcclientPanelRoot,
        ucclientUcurl: this._UccacWrapper.getUcurl(),
        ucclientTenant: this._OperatorConsoleAsParent.getLoginTenantname(),
        ucclientUser: this._OperatorConsoleAsParent.getLoginUsername(),
        ucclientPass: this._OperatorConsoleAsParent.getLoginPassword(),
      }
      this._uccacAc.startUCClient(startUCClientOptions)
      setTimeout(() => {
        this.setState({ isRestartButtonDisabled: false })
      }, 8000)
    })
  }

  render() {
    const uccacwidgetFgColor = Util.getRgbaCSSStringFromAntdColor(
      this.props.uccacwidgetFgColor,
      '',
    )
    const uccacwidgetBgColor = Util.getRgbaCSSStringFromAntdColor(
      this.props.uccacwidgetBgColor,
      'rgba(255,255,255,255)',
    )
    const borderRadius = parseInt(
      this.props.borderRadius ? this.props.borderRadius : '',
    )
    const outsideShadow_horizontalOffset = this.props
      .outsideShadow_horizontalOffset
      ? this.props.outsideShadow_horizontalOffset
      : ''
    const outsideShadow_verticalOffset = this.props.outsideShadow_verticalOffset
      ? this.props.outsideShadow_verticalOffset
      : ''
    const outsideShadow_blur = this.props.outsideShadow_blur
      ? this.props.outsideShadow_blur
      : ''
    const outsideShadow_spread = this.props.outsideShadow_spread
      ? this.props.outsideShadow_spread
      : ''
    const outsideShadowColorRgb = Util.getRgbaCSSStringFromAntdColor(
      this.props.outsideShadow_color,
      'rgba(0,0,0,0)',
    ) // "rgba(0,0,0,0.2)"  //!default

    const insideShadow_horizontalOffset = this.props
      .insideShadow_horizontalOffset
      ? this.props.insideShadow_horizontalOffset
      : ''
    const insideShadow_verticalOffset = this.props.insideShadow_verticalOffset
      ? this.props.insideShadow_verticalOffset
      : ''
    const insideShadow_blur = this.props.insideShadow_blur
      ? this.props.insideShadow_blur
      : ''
    const insideShadow_spread = this.props.insideShadow_spread
      ? this.props.insideShadow_spread
      : ''
    const insideShadowColorRgb = Util.getRgbaCSSStringFromAntdColor(
      this.props.insideShadow_color,
      'rgba(0,0,0,0)',
    ) // "rgba(48,71,1,1)" //!default

    const sBoxshadowOutside =
      outsideShadowColorRgb &&
      outsideShadow_horizontalOffset &&
      outsideShadow_verticalOffset &&
      outsideShadow_blur &&
      outsideShadow_spread
        ? outsideShadowColorRgb +
          ' ' +
          outsideShadow_horizontalOffset +
          'px ' +
          outsideShadow_verticalOffset +
          'px ' +
          outsideShadow_blur +
          'px ' +
          outsideShadow_spread +
          'px'
        : ''
    const sBoxshadowInside =
      insideShadowColorRgb &&
      insideShadow_horizontalOffset &&
      insideShadow_verticalOffset &&
      insideShadow_blur &&
      insideShadow_spread
        ? 'inset ' +
          insideShadowColorRgb +
          ' ' +
          insideShadow_horizontalOffset +
          'px ' +
          insideShadow_verticalOffset +
          'px ' +
          insideShadow_blur +
          'px ' +
          insideShadow_spread +
          'px'
        : ''
    const sBoxShadow =
      sBoxshadowOutside +
      (sBoxshadowOutside && sBoxshadowInside ? ',' : '') +
      sBoxshadowInside

    if (this._IsEditMode) {
      return (
        <View
          style={[
            styles.container,
            { borderRadius, backgroundColor: uccacwidgetBgColor },
          ]}
        >
          <Text style={[styles.text, { color: uccacwidgetFgColor }]}>
            ucChatAgentComponentIsInEditMode
          </Text>
        </View>
      )
    } else if (!this._UccacWrapper.isInitialized()) {
      return (
        <View
          style={[
            styles.container,
            { borderRadius, backgroundColor: uccacwidgetBgColor },
          ]}
        >
          <Text style={[styles.text, { color: uccacwidgetFgColor }]}>
            ucChatAgentComponentIsDisabled
          </Text>
        </View>
      )
    } else {
      return (
        <View
          style={[
            styles.mainContainer,
            { borderRadius, backgroundColor: uccacwidgetBgColor },
          ]}
        >
          <View
            ref={this._uccacRootElementRef}
            style={[
              styles.uccacRootElement,
              { height: Dimensions.get('screen').width - 30 },
            ]}
          >
            <View style={styles.leftPanel}>
              <Text style={{ color: uccacwidgetFgColor }}>
                {'webchatqueue'}
              </Text>
              <Text style={{ color: uccacwidgetFgColor }}>
                {'webchatpickup'}
              </Text>
              <Text style={{ color: uccacwidgetFgColor }}>{'search'}</Text>
            </View>
            <View style={styles.rightPanel} />
          </View>
          <View style={styles.footer}>
            <Button
              title='Restart'
              onPress={this._onClickRestart.bind(this)}
              disabled={this.state.isRestartButtonDisabled}
              color={uccacwidgetFgColor}
            />
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    padding: 6,
  },
  text: {
    color: '#333',
  },
  mainContainer: {
    height: '100%',
  },
  uccacRootElement: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  leftPanel: {
    position: 'relative',
    width: '50%',
    height: '100%',
  },
  rightPanel: {
    position: 'relative',
    width: '50%',
    height: '100%',
  },
  footer: {
    height: 30,
    padding: 4,
  },
})
