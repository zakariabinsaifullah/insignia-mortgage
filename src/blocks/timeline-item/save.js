import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { RenderIcon } from '../../helpers';

const Save = props => {
    const { attributes } = props;
    const { iconName, customSvgCode, blockStyle } = attributes;

    const blockProps = useBlockProps.save( {
        style: blockStyle
    } );

    return (
        <div { ...blockProps }>
            <div className="timeline-icon">
                <RenderIcon customSvgCode={ customSvgCode } iconName={ iconName } size={ 48 } />
            </div>
            <div className="timeline-content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
