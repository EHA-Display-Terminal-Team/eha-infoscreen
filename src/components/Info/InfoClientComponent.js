// InfoClientComponent.js
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import ErrorComponent from '../ErrorComponent';

export default function InfoClientComponent() {
    const { data: session } = useSession();
    const [note, setNote] = useState('');
    const [allNotes, setAllNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editText, setEditText] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    // Fetch all notes from database
    async function fetchNotes() {
        try {
            const response = await fetch('/api/infonote');
            const data = await response.json();
            if (response.ok) {
                setAllNotes(data.notes.rows);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handleEditNote = (id, currentNote) => {
        setEditingNoteId(id);
        setEditText(currentNote);
    };

    // Save a note to the database
    const handleSaveNote = async () => {
        if (!note) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/infonote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note }),
            });

            if (!response.ok) {
                throw new Error('Failed to save note');
            } else {
                await fetchNotes();
                setNote('');
            }
            setIsEditing(false); // Hides the textarea after saving
        } catch (err) {
            setError('Failed to save note. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Edit an existing note
    const handleUpdateNote = async () => {
        try {
            const response = await fetch('/api/infonote', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingNoteId, note: editText }),
            });

            if (!response.ok) throw new Error('Failed to update note');

            const data = await response.json();

            // Refresh notes
            await fetchNotes();

            setEditingNoteId(null);
            setEditText('');
        } catch (error) {
            console.error('Error updating note:', error.message);
        }
    };

    // Delete a note from the database
    const handleDeleteNote = async (id) => {
        try {
            const response = await fetch('/api/infonote', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete note');
            }

            // Refresh the notes list after deletion
            await fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    if (error) {
        return <ErrorComponent message={error?.message} />;
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-1">
            <ul>
                {allNotes.map((note) => (
                    <li
                        key={note.id}
                        className="py-1 text-sm flex items-center"
                    >
                        {editingNoteId === note.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) =>
                                        setEditText(e.target.value)
                                    }
                                    className="border rounded-md p-1 text-sm flex-1 text-black"
                                />
                                <button
                                    onClick={() => setEditingNoteId(null)}
                                    className="ml-2"
                                >
                                    <img
                                        src={'/svgs/cancel_gray.svg'}
                                        alt="Cancel edit"
                                        style={{
                                            width: '25px',
                                            height: '25px',
                                        }}
                                    />
                                </button>
                                <button
                                    onClick={handleUpdateNote}
                                    className="ml-2"
                                >
                                    <img
                                        src={'/svgs/save_green.svg'}
                                        alt="Save note"
                                        style={{
                                            width: '25px',
                                            height: '25px',
                                        }}
                                    />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1">{note.note}</span>
                                {session && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleDeleteNote(note.id)
                                            }
                                            className="ml-2"
                                        >
                                            <img
                                                src={'/svgs/delete_red.svg'}
                                                alt="Delete note"
                                                style={{
                                                    width: '25px',
                                                    height: '25px',
                                                }}
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleEditNote(
                                                    note.id,
                                                    note.note
                                                )
                                            }
                                            className="ml-2"
                                        >
                                            <img
                                                src={'/svgs/edit_yellow.svg'}
                                                alt="Edit note"
                                                style={{
                                                    width: '25px',
                                                    height: '25px',
                                                }}
                                            />
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {session ? (
                <div>
                    {isEditing ? (
                        <div>
                            <textarea
                                value={note}
                                onChange={handleNoteChange}
                                className="w-full p-2 border border-gray-300 rounded-md resize-none text-black"
                                rows={4}
                            />
                            <div className="flex justify-between mt-2">
                                <button
                                    onClick={handleSaveNote}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        'Saving...'
                                    ) : (
                                        <img
                                            src={'/svgs/save_green.svg'}
                                            alt="Save note"
                                            style={{
                                                width: '25px',
                                                height: '25px',
                                            }}
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="ml-2"
                                >
                                    <img
                                        src={'/svgs/cancel_gray.svg'}
                                        alt="Cancel edit"
                                        style={{
                                            width: '25px',
                                            height: '25px',
                                        }}
                                    />
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-500 mt-2">{error}</p>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)} // Shows textarea when adding a new note
                            style={{ backgroundColor: '#fac807' }}
                            className="py-1 px-3 text-white rounded-md shadow-md hover:bg-yellow-400 text-xs"
                        >
                            Add a new note
                        </button>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => signIn()}
                    style={{ backgroundColor: '#fac807' }}
                    className="py-1 px-3 text-white rounded-md shadow-md hover:bg-yellow-400 text-xs"
                >
                    Log in
                </button>
            )}

            {session && (
                <button
                    onClick={() => signOut()}
                    className="py-1 px-3 bg-gray-600 hover:bg-gray-500 text-white rounded-md shadow-md text-xs"
                >
                    Log out
                </button>
            )}
        </div>
    );
}
