/**
 * Payload for hooks
 *
 * pre-create -> POST /files/
 *    -> Event.Upload.ID      "null"
 *    -> Event.Upload.Storage null
 * post-create -> POST /files/
 *    -> metadata de pre-create
 *    -> Event.Upload.ID      complété
 *    -> Event.Upload.Storage complété
 * pre-finish  -> PATCH /files/lhapaipai/public-page/xxx
 *    -> metadata de pre-create pas de post-create
 * post-finish -> PATCH /files/lhapaipai/public-page/xxx
 *    -> metadata de pre-create pas du reste
 * post-receive -> PATCH /files/lhapaipai/public-page/xxx
 *    -> metadata de pre-create pas du reste
 */
export type TusHookBody = {
  Type:
    | "pre-create"
    | "post-create"
    | "pre-finish"
    | "post-finish"
    | "post-receive"
    | "post-terminate";
  Event: {
    Upload: {
      /**
       * null with pre-create hook
       */
      ID: "null" | string;
      Size: number;
      SizeIsDeferred: boolean;
      Offset: number;
      /**
       * MetaDatas send from
       *   - client
       *   - hook : only pre-create
       */
      MetaData: BaseMetaData & ExtraMetaData;
      IsPartial: boolean;
      IsFinal: boolean;
      PartialUploads: null | string[];
      /**
       * null for pre-create hook
       */
      Storage: FileStore | S3Store | null;
    };
    HTTPRequest: {
      Method: "POST" | "PATCH";
      URI: string;
      RemoteAddr: string;
      Header: {
        "Tus-Resumable": string[];
        "Upload-Offset": string[];
        [key: string]: string[];
      };
    };
  };
};

export type BaseMetaData = {
  filename: string;
  filetype: string;
  name: string;
  relativePath: string | "null";
  type: string;
};

export type ExtraMetaData = {
  width: string | "null";
  height: string | "null";
  size: string | "null";
  id: string;
  storage: "s3store" | "filestore";
};

/**
 * {
 *   "filename": "identite.jpg",
 *   "filetype": "image/jpeg",
 *   "name": "identite.jpg",
 *   "relativePath": "null",
 *   "type": "image/jpeg",
 *   "width": "803",
 *   "height": "788",
 *   "size": "54321",
 *   "id": "d29b33cc-8c6a-432e-85ed-d1a6e6a5efc1",
 *   "storage": "s3store"
 * }
 */
export type TusResponseBody = BaseMetaData & ExtraMetaData;

type FileStore = {
  Type: "filestore";
  InfoPath: string;
  Path: string;
};

type S3Store = {
  Type: "s3store";
  Bucket: string;
  Key: string;
};

export type PreCreateResponse = {
  /**
   * permet d'interdire l'upload
   */
  RejectUpload?: boolean;

  // envoyer des détails sur l'arrêt au client.
  HTTPResponse?: HTTPResponse;

  /**
   * uniquement pour pre-create permet de changer des propriétés d'un
   * upload avant qu'il ne soit créé.
   */
  ChangeFileInfo?: {
    // explicite un ID pour l'upload, sinon un ID unique sera généré par le serveur.
    ID?: string;

    /**
     * Ajoute des meta-données pour les autres hooks (comme pour
     * ChangeFileInfo seulement disponible dans le hook pre-create)
     */
    MetaData?: Record<string, string>;

    Storage?: FileStoreResponse;
  };
};

export type PostReceiveResponse = {
  // Entraînera l'arrêt du téléchargement lors d'une requête PATCH.
  StopUpload?: boolean;

  // envoyer des détails sur l'arrêt au client.
  HTTPResponse?: HTTPResponse;
};

export type PreFinishResponse = {
  // envoie des informations supplémentaires au client
  HTTPResponse?: HTTPResponse;
};

//D'autres stockages, tels que S3Store, GCSStore et AzureStore, ne prennent pas encore en charge la propriété Storage.
type FileStoreResponse = {
  Path?: string;
};

type HTTPResponse = {
  StatusCode: number;
  Body: string;
  Header: Record<string, string>;
};

export type TusHookResponse = PreCreateResponse | PostReceiveResponse | PreFinishResponse;
