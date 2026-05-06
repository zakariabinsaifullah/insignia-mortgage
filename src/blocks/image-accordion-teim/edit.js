// import editor style
import './editor.scss';

/**
 * WordPress Dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import classNames from 'classnames';

/**
 * Placeholder Image
 */
import placeholderImage from '../../../assets/images/placeholder.svg';

/**
 * Internal Dependencies
 */
import Inspector from './inspector';

// block edit function
const Edit = props => {
    const { attributes, setAttributes, isSelected } = props;
    const { uniqueId, preset, image, heading, description, buttonText, buttonUrl } = attributes;

    const blockProps = useBlockProps({
        className: classNames(uniqueId, preset)
    });

    return (
        <Fragment>
            {isSelected && <Inspector {...props} />}
            <div {...blockProps}>
                <div className="img">
                    <img src={image?.url || placeholderImage} alt={image?.alt || 'accordion'} className="img-cover" />
                </div>
                <div className="info">
                    <RichText
                        tagName="h3"
                        value={heading}
                        onChange={value => setAttributes({ heading: value })}
                        placeholder={__('Heading…', 'insignia')}
                    />
                    <RichText
                        tagName="p"
                        value={description}
                        onChange={value => setAttributes({ description: value })}
                        placeholder={__('Description…', 'insignia')}
                    />
                    <div className="accordion-btn-wrap">
                        <span className="accordion-btn">
                            {buttonText || __('Learn More', 'insignia')}
                        </span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Edit;
