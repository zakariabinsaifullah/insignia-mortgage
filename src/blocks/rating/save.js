/**
 * WordPress Dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import StarRating from '../../components/star-rating';

// block save function
const Save = props => {
    const { attributes } = props;
    const { nrPos, rating, enableRating, totalRating, blockStyle } = attributes;

    const blockProps = useBlockProps.save({
        style: blockStyle
    });

    return (
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
    );
};

export default Save;
