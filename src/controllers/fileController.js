// controllers/file.controller.js
import { uploadAvatar, uploadVerificationDocs } from '../utils/fileUpload.js';
import fileService from '../services/file.service.js';

class FileController {
  async uploadAvatar(req, res, next) {
    uploadAvatar(req, res, async (err) => {
      if (err) return next(ApiError.BadRequest(err.message));

      try {
        const avatarUrl = await fileService.updateAvatar(
          req.user.id,
          req.file.path
        );
        res.json({ avatarUrl });
      } catch (error) {
        next(error);
      }
    });
  }

  async uploadVerificationDocs(req, res, next) {
    uploadVerificationDocs(req, res, async (err) => {
      if (err) return next(ApiError.BadRequest(err.message));

      try {
        const documents = await fileService.addVerificationDocuments(
          req.user.id,
          req.files.map(f => ({
            path: f.path,
            originalName: f.originalname,
            mimetype: f.mimetype
          }))
        );
        res.json(documents);
      } catch (error) {
        next(error);
      }
    });
  }

  async deleteVerificationDoc(req, res, next) {
    try {
      await fileService.deleteDocument(
        req.user.id,
        req.params.docId
      );
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export default new FileController();