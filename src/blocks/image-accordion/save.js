/**
 * WordPress Dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

// block save function
const Save = props => {
    const { attributes } = props;
    const { height, overlayColor } = attributes;

    const blockProps = useBlockProps.save({
        style: {
            '--accordion-height': `${height || 500}px`,
            '--accordion-overlay': overlayColor || 'rgba(18, 100, 100, 0.6)'
        }
    });

    return (
        <div {...blockProps}>
            <div className="insignia-image-accordion">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
