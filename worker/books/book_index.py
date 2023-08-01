import os
from llama_index import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)

from llama_index import VectorStoreIndex, SimpleDirectoryReader


persist_dir = os.path.dirname(__file__)
docs_dir = os.path.join(persist_dir, "books")


def build():
    documents = SimpleDirectoryReader(docs_dir).load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=persist_dir)
    return index


def load():
    storage_context = StorageContext.from_defaults(persist_dir=persist_dir)
    index = load_index_from_storage(storage_context)
    return index
