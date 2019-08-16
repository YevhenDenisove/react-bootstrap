import * as React from 'react';

import { BsPrefixComponent } from './helpers';

export declare class InputGroupAppend<
  As extends React.ElementType = 'div'
> extends BsPrefixComponent<As> {}

export declare class InputGroupPrepend<
  As extends React.ElementType = 'div'
> extends BsPrefixComponent<As> {}

export declare class InputGroupText<
  As extends React.ElementType = 'span'
> extends BsPrefixComponent<As> {}

export declare class InputGroupCheckbox extends BsPrefixComponent<'input'> {}

export declare class InputGroupRadio extends BsPrefixComponent<'input'> {}

export interface InputGroupProps {
  size?: 'sm' | 'lg';
}

declare class InputGroup<
  As extends React.ElementType = 'div'
> extends BsPrefixComponent<As, InputGroupProps> {
  static Append: typeof InputGroupAppend;
  static Prepend: typeof InputGroupPrepend;
  static Text: typeof InputGroupText;
  static Checkbox: typeof InputGroupCheckbox;
  static Radio: typeof InputGroupRadio;
}

export default InputGroup;
