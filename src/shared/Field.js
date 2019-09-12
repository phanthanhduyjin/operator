import { mdiClose, mdiPlus } from '@mdi/js';
import omit from 'lodash/omit';
import React from 'react';

import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../native/Rn';
import Icon from '../shared/Icon';
import v from '../variables';

const s = StyleSheet.create({
  Field: {
    borderBottomWidth: 1,
    borderColor: v.brekekeShade1,
    height: 50,
    alignItems: 'stretch',
  },
  Field__disabled: {
    backgroundColor: v.brekekeShade0,
  },
  Field_Name: {
    position: 'absolute',
    top: 15,
    left: 7,
    fontSize: v.fontSizeSmall,
    color: v.brekekeShade6,
  },
  Field_TextInput: {
    width: '100%',
    height: 50,
    paddingTop: 28,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 40,
    fontWeight: 'bold',
  },
  Field_TextInput__value: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomWidth: 1,
    borderColor: v.brekekeShade1,
  },
  Field_Switch: {
    position: 'absolute',
    top: 22,
    right: 11,
  },
  Field_Btn: {
    position: 'absolute',
    top: 15,
    right: 5,
    width: 40,
    height: 30,
    borderRadius: v.borderRadius,
  },
  Field_Btn__create: {
    backgroundColor: v.fn.transparentize(0.9, v.brekekeGreen),
  },
  Field_Btn__remove: {
    backgroundColor: v.fn.transparentize(0.9, v.brekekeRed),
  },
  Field_Icon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});

const renderField = p => (
  <View>
    <View>
      <View
        style={[s.Field, p.disabled && s.Field__disabled]}
        pointerEvents={p.disabled ? 'none' : null}
      >
        {p.inputElement}
      </View>
      <Text style={s.Field_Name} pointerEvents={p.inputElement ? 'none' : null}>
        {p.name}
      </Text>
      <Text
        style={[s.Field_TextInput, s.Field_TextInput__value]}
        pointerEvents={p.inputElement ? 'none' : null}
      >
        {(!p.inputElement &&
          ((p.valueRender && p.valueRender(p.value)) || p.value)) ||
          '\u00A0'}
      </Text>
    </View>
    {(p.iconRender && p.iconRender(p.value)) ||
      (p.icon && (
        <Icon
          path={p.icon}
          style={s.Field_Icon}
          pointerEvents={p.inputElement ? 'none' : null}
        />
      ))}
  </View>
);
const Field = p => {
  if (p.onCreateBtnPress) {
    p = {
      ...p,
      iconRender: () => (
        <TouchableOpacity
          style={[s.Field_Btn, s.Field_Btn__create]}
          onPress={p.onCreateBtnPress}
        >
          <Icon
            style={s.Field_CreateRemoveIcon}
            path={mdiPlus}
            size={18}
            fill={v.brekekeGreen}
          />
        </TouchableOpacity>
      ),
    };
  }
  if (p.onRemoveBtnPress) {
    p = {
      ...p,
      iconRender: () => (
        <TouchableOpacity
          style={[s.Field_Btn, s.Field_Btn__remove]}
          onPress={p.onRemoveBtnPress}
        >
          <Icon
            style={s.Field_CreateRemoveIcon}
            path={mdiClose}
            size={15}
            fill={v.brekekeRed}
          />
        </TouchableOpacity>
      ),
    };
  }
  if (!p.onValueChange || p.disabled) {
    return renderField(p);
  }
  if (p.type === 'Switch') {
    p = {
      ...p,
      valueRender: v => (v ? 'Enabled' : 'Disabled'),
      iconRender: v => (
        <Switch style={s.Field_Switch} pointerEvents="none" enabled={v} />
      ),
    };
    if (p.disabled) {
      return renderField(p);
    }
    return (
      <TouchableOpacity onPress={() => p.onValueChange(!p.value)}>
        {renderField(p)}
      </TouchableOpacity>
    );
  } else {
    return renderField({
      ...p,
      inputElement: (
        <TextInput
          style={s.Field_TextInput}
          onChangeText={p.onValueChange}
          onSubmitEditing={p.onCreateBtnPress}
          {...omit(p, [
            'type',
            'name',
            'valueRender',
            'icon',
            'iconRender',
            'onValueChange',
            'onCreateBtnPress',
            'onRemoveBtnPress',
          ])}
        />
      ),
    });
  }
};

export default Field;
