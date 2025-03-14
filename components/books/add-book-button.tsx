export default function AddBookButton() {
  return (
    <div>
      <h1>Add Book</h1>
      <form>
        <input type="text" placeholder="Title..." />
        <input type="text" placeholder="Author..." />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
