/**
 * WordPress Dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

// block save function
const Save = props => {
    const { attributes } = props;
    const { uniqueId, image, heading, description, buttonText, buttonUrl, buttonNewTab, overlayGraident } = attributes;

    const blockProps = useBlockProps.save( {
        className: uniqueId
    } );

    return (
        <div { ...blockProps } 
            {...overlayGraident && {
            'style': {
                '--overlay-gradient': overlayGraident
            }
        }}>
            <div className="img">
                <img src={ image?.url } alt={ image?.alt || 'accordion' } className="img-cover" />
            </div>
            <div className="info">
                <RichText.Content tagName="h3" value={ heading } />
                <RichText.Content tagName="p" value={ description } />
                <div className="accordion-btn-wrap">
                    <a
                        href={ buttonUrl || '#' }
                        className="accordion-btn"
                        target={ buttonNewTab ? '_blank' : '_self' }
                        rel={ buttonNewTab ? 'noopener noreferrer' : undefined }
                    >
                        <span>{ buttonText || 'Learn More' }</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Save;
