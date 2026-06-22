import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { badgeText, footerNote, blockStyle } = attributes;

    return (
        <div {...useBlockProps.save({ style: blockStyle, className: 'insignia-frame' })}>
            <div className="insignia-frame__badge">
                <RichText.Content tagName="span" value={badgeText} />
            </div>
            <div className="insignia-frame__inner">
                <InnerBlocks.Content />
            </div>
            <div className="insignia-frame__footer">
                <RichText.Content tagName="span" value={footerNote} />
            </div>
        </div>
    );
}
