import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(chaiEnzyme());
chai.use(sinonChai);

import ListPhotos from './list-photos';

describe('Admin <ListPhotos />', () => {
    let props, wrapper;

    beforeEach(() => {
        props = {
            photos: [{
                key: 'key',
                small: '/small',
                description: 'Photo description'
            }],
            onDeleteClick: sinon.spy(),
            onUpdateClick: sinon.spy()
        };
        wrapper = shallow(<ListPhotos {...props} />);
    });

    it('should contain image', () => {
        expect(wrapper).to.contain(<img src="/small" />);
    });

});
