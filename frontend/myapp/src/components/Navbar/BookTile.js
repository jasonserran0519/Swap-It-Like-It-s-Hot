import { Link } from 'react-router-dom';
import './BookTile.css';

function BookTile({book}) {

    const placeholderImage = `${process.env.PUBLIC_URL}/images/placeholder.png`;

    return (
        <Link key={book.id} to={`/books/${book.id}`} className="book-tile">
            <img 
                src={book.pic && book.pic.length > 0 ? book.pic[0] : placeholderImage} 
                alt={book.name} 
                className="book-image" 
            />

            <div className="book-info">
                <h2>{book.name}</h2>
                <h3>{book.author}</h3>
                <h3>
                    ${new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(book.price)}
                </h3>
            </div>
        </Link>
    );

}

export default BookTile;
