import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import './editor.scss';
import Inspector from './inspector';

export default function Edit({ attributes, setAttributes, isSelected }) {
    const { gap } = attributes;

    const blockProps = useBlockProps({
        className: `marquee-wrapper marquee-horizontal`
    });

    const TEMPLATE = [['core/paragraph']];

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `gutenlayouts-marquee-items`,
            style: {
                gap: `${gap}px`
            }
        },
        {
            template: TEMPLATE
        }
    );

    return (
        <>
            <div {...blockProps}>
                {isSelected && <Inspector attributes={attributes} setAttributes={setAttributes} />}
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}
