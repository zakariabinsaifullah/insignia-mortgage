// import editor style
import './editor.scss';

/**
 * WordPress Dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * External Dependencies
 */
import classNames from 'classnames';

/**
 * Placeholder Image
 */
import placeholderImage from '../../../assets/images/placeholder.svg';

/**
 * Internal Dependencies
 */
import Inspector from './inspector';

const INNER_BLOCKS_TEMPLATE = [['core/paragraph', { placeholder: 'Add content here…' }]];

// block edit function
const Edit = props => {
    const { attributes, setAttributes, isSelected } = props;
    const { uniqueId, preset, image } = attributes;

    const blockProps = useBlockProps({
        className: classNames(uniqueId, preset)
    });

    return (
        <Fragment>
            {isSelected && <Inspector {...props} />}
            <div {...blockProps}>
                <div className="img">
                    <img src={image?.url || placeholderImage} alt={image?.alt || 'accordion'} className="img-cover" />
                </div>
                <div className="info">
                    <InnerBlocks template={INNER_BLOCKS_TEMPLATE} templateLock={false} />
                </div>
            </div>
        </Fragment>
    );
};

export default Edit;
