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
        <path d="M120-520v-320h320v320zm0 400v-320h320v320zm400-400v-320h320v320zm0 400v-320h320v320zM200-600h160v-160H200zm400 0h160v-160H600zm0 400h160v-160H600zm-400 0h160v-160H200zm160-400" />
    </svg>
);

registerBlockType(metadata.name, {
    icon: inlineIcon,
    edit: Edit,
    save
});
