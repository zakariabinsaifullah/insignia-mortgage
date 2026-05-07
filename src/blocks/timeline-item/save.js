import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = props => {
    const { attributes } = props;
    const { icon, blockStyle } = attributes;

    const blockProps = useBlockProps.save({
        style: blockStyle
    });

    return (
        <div {...blockProps}>
            <div className="timeline-icon">
                {icon?.url && (
                    <img src={icon.url} alt={icon.alt || ''} />
                )}
            </div>
            <div className="timeline-content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
