/**
 * WordPress Dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

// block save function
const Save = props => {
    const { attributes } = props;
    const { uniqueId, image } = attributes;

    const blockProps = useBlockProps.save({
        className: uniqueId
    });

    return (
        <div {...blockProps}>
            <div className="img">
                <img src={image?.url} alt={image?.alt || 'accordion'} className="img-cover" />
            </div>
            <div className="info">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
