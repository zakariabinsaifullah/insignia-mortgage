import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classNames from 'classnames';

const Save = props => {
    const { attributes } = props;
    const { uniqueId, contentGap, itemsGap } = attributes;

    const blockProps = useBlockProps.save( {
        className: classNames( uniqueId ),
        style: {
            ...( contentGap && { '--item-gap': `${ contentGap }px` } ),
            ...( itemsGap && { '--items-gap': `${ itemsGap }px` } )
        }
    } );

    return (
        <div { ...blockProps }>
            <div className="insignia-timeline">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
