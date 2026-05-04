/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import Inspector from './inspector';
/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */
import StarRating from '../../components/star-rating';

// block edit function
const Edit = props => {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const { nrPos, rating, enableRating, totalRating, ratingSize, ratingNsize, ratingColor, nuRatColor, alignment } = attributes;
    const cssCustomProperties = {
        ...(ratingSize && { '--rating-size': `${ratingSize}px` }),
        ...(ratingNsize && { '--value-size': `${ratingNsize}px` }),
        ...(ratingColor && { '--rating-color': ratingColor }),
        ...(nuRatColor && { '--numberic-color': nuRatColor }),
        ...(alignment && { '--rating-align': alignment })
    };
    const blockProps = useBlockProps({
        style: cssCustomProperties
    });
    useEffect(() => {
        setAttributes({
            blockStyle: cssCustomProperties
        });
    }, [ratingSize, ratingNsize, ratingColor, nuRatColor, alignment]);
    /**
     * Block Props
     */

    return (
        <>
            {isSelected && <Inspector {...props} />}
            <div {...blockProps}>
                <div className={`rating-container ${nrPos}`}>
                    <StarRating total={totalRating} rating={rating} />
                    {enableRating && (
                        <div className="numeric-rating">
                            <span className="rating-number">{rating}</span>
                            <span className="rating-bar">/</span>
                            <span className="total-rating">{totalRating}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Edit;
