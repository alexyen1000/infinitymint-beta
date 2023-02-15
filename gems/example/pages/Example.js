import React from 'react';
import HelloWorld from '../components/HelloWorld';

function Example() {
    return (
        <div>
            <HelloWorld />
        </div>
    );
}

Example.page = {
    url: '/example',
};

export default Example;
