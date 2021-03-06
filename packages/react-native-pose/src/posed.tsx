import * as React from 'react';
import { Animated } from 'react-native';
import { PoseComponent, PoseParentContext } from './components/PoseComponent';
import { Posed, PosedComponentFactory, PoseContextProps } from './types';

const posedComponentFactory: PosedComponentFactory = (Component: any) => ({
  draggable,
  ...config
} = {}) => ({ withParent = true, ...props }) =>
  !withParent || props.parentValues ? (
    <PoseComponent
      poseConfig={config}
      Component={Component}
      draggable={draggable}
      {...props}
    />
  ) : (
    <PoseParentContext.Consumer>
      {(parentCtx: PoseContextProps) => (
        <PoseComponent
          poseConfig={config}
          draggable={draggable}
          Component={Component}
          {...props}
          {...parentCtx}
        />
      )}
    </PoseParentContext.Consumer>
  );

const componentMap: { [key: string]: React.Component } = {
  View: Animated.View,
  ScrollView: Animated.ScrollView,
  Image: Animated.Image,
  Text: Animated.Text
};

const posedComponent: Posed = (Component?: any) =>
  posedComponentFactory(
    Component ? Animated.createAnimatedComponent(Component) : undefined
  );

const posed: Posed = Object.keys(componentMap).reduce((acc, key) => {
  const Component = componentMap[key];
  acc[key] = posedComponentFactory(Component);
  return acc;
}, posedComponent);

export default posed;
