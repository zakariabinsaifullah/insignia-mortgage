import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './view.js';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const inlineIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120zm0-80h560v-560H200zm0-560v560zm280 480q17 0 28.5-11.5T520-320t-11.5-28.5T480-360t-28.5 11.5T440-320t11.5 28.5T480-280m-131.5-11.5Q360-303 360-320t-11.5-28.5T320-360t-28.5 11.5T280-320t11.5 28.5T320-280t28.5-11.5M640-280q17 0 28.5-11.5T680-320t-11.5-28.5T640-360t-28.5 11.5T600-320t11.5 28.5T640-280"/></svg>
);

registerBlockType( metadata.name, {
    icon: inlineIcon,
    /**
     * @see ./edit.js
     */
    edit: Edit,

    /**
     * @see ./save.js
     */
    save
} );
