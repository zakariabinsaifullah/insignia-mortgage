import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const inlineIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#1f1f1f">
        <path d="M120-200q-33 0-56.5-23.5T40-280v-400q0-33 23.5-56.5T120-760h400q33 0 56.5 23.5T600-680v400q0 33-23.5 56.5T520-200zm0-146q44-26 94-40t106-14 106 14 94 40v-334H120zm200 26q-41 0-80 10t-74 30h308q-35-20-74-30t-80-10m-77.5-142.5Q210-495 210-540t32.5-77.5T320-650t77.5 32.5T430-540t-32.5 77.5T320-430t-77.5-32.5M320-504q15 0 25.5-10.5T356-540t-10.5-25.5T320-576t-25.5 10.5T284-540t10.5 25.5T320-504m360 304v-560h80v560zm160 0v-560h80v560zm-520-80" />
    </svg>
);

registerBlockType(metadata.name, {
    icon: inlineIcon,
    edit: Edit,
    save
});
