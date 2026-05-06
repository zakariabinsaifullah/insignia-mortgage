import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classNames from 'classnames';

const Save = props => {
    const { attributes } = props;
    const { uniqueId } = attributes;

    const blockProps = useBlockProps.save({
        className: classNames(uniqueId)
    });

    return (
        <div {...blockProps}>
            <div className="insignia-timeline">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
