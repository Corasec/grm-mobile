import React from 'react';
import { render } from '@testing-library/react-native';

// Basic placeholder test - expand as the package grows
describe('LearningMaterialsList', () => {
  it('placeholder - package structure is correct', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBe('grm-learning-materials');
    expect(pkg.version).toBeDefined();
  });
});
