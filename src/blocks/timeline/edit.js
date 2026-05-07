import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import Inspector from './inspector';

const TEMPLATE = [
    ['insignia/timeline-item', {}],
    ['insignia/timeline-item', {}],
    ['insignia/timeline-item', {}]
];

const Edit = props => {
    const { attributes, clientId, isSelected } = props;
    const { uniqueId, contentGap, itemsGap } = attributes;

    const cssCustomProperties = {
        ...(contentGap && { '--item-gap':  `${contentGap}px` }),
        ...(itemsGap   && { '--items-gap': `${itemsGap}px`  }),
    };

    const blockProps = useBlockProps({
        className: classNames(uniqueId),
        style: cssCustomProperties
    });

    const innerBlockProps = useInnerBlocksProps(
        { className: 'insignia-timeline' },
        {
            allowedBlocks: ['insignia/timeline-item'],
            template: TEMPLATE,
            templateLock: false,
            renderAppender: () => {
                const childBlocks = wp.data.select('core/block-editor').getBlocks(clientId);
                return (
                    <button
                        className="insignia-timeline-add-btn"
                        onClick={() => {
                            const newBlock = wp.blocks.createBlock('insignia/timeline-item', {});
                            wp.data
                                .dispatch('core/block-editor')
                                .insertBlocks(newBlock, childBlocks.length, clientId);
                        }}
                    >
                        {__('+ Add Timeline Item', 'insignia')}
                    </button>
                );
            }
        }
    );

    return (
        <Fragment>
            {isSelected && <Inspector {...props} />}
            <div {...blockProps}>
                <div {...innerBlockProps} />
            </div>
        </Fragment>
    );
};

export default Edit;
